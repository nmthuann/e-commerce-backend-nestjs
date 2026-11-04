import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { AuthError, UserError } from 'src/common/enums/errors.enum';
import { Role } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { comparePassword, hashPassword } from 'src/common/utils/password.util';
import { EnvironmentVariables } from 'src/config/env.validation';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserService } from 'src/modules/users/domain/services/user.service';
import {
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto/auth.dto';

// Refresh token là JWT dài, entropy cao → SHA-256 là đủ (không dùng bcrypt vì bcrypt chỉ đọc 72 byte đầu)
const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

const safeEqual = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly userService: UserService,
  ) {}

  /** Đăng ký tài khoản khách hàng (CUSTOMER) và đăng nhập luôn */
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    if (await this.userService.emailExists(data.email)) {
      throw new ConflictException(AuthError.EMAIL_EXISTS);
    }
    const user = await this.userService.create({
      email: data.email,
      passwordHash: await hashPassword(data.password),
      fullName: data.fullName,
      phone: data.phone,
      role: Role.CUSTOMER,
    });
    return this.issueTokens(user);
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findWithSecrets({ email: data.email });
    // Cùng một thông báo cho "sai email" và "sai mật khẩu" để không lộ email nào đã đăng ký
    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS);
    }
    this.assertCanSignIn(user);
    return this.issueTokens(user);
  }

  /** Xoay vòng: mỗi refresh token chỉ dùng được 1 lần */
  async refresh(data: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        data.refreshToken,
        {
          secret: this.config.get('REFRESH_JWT_SECRET_KEY', { infer: true }),
        },
      );
    } catch {
      throw new UnauthorizedException(AuthError.REFRESH_TOKEN_INVALID);
    }

    const user = await this.userService.findWithSecrets({ id: payload.sub });
    if (
      !user?.refreshTokenHash ||
      !safeEqual(user.refreshTokenHash, sha256(data.refreshToken))
    ) {
      // Chữ ký đúng nhưng không phải token đang lưu → đã bị dùng lại hoặc đã thu hồi → thu hồi luôn phiên hiện tại
      if (user) await this.userService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException(AuthError.REFRESH_TOKEN_INVALID);
    }
    this.assertCanSignIn(user);
    // Payload dựng lại từ DB → role / position mới nhất có hiệu lực ngay
    return this.issueTokens(user);
  }

  /** Thu hồi refresh token; access token còn hiệu lực tới khi hết hạn (JWT_ACCESS_EXPIRES_IN) */
  async logout(userId: string): Promise<void> {
    await this.userService.setRefreshTokenHash(userId, null);
  }

  private assertCanSignIn(user: UserEntity) {
    if (user.status !== UserStatus.ACTIVE)
      throw new ForbiddenException(AuthError.ACCOUNT_NOT_ACTIVE);
    if (user.role === Role.STAFF && !user.employee?.isActive)
      throw new ForbiddenException(UserError.NOT_ACTIVE_EMPLOYEE);
  }

  private buildPayload(user: UserEntity): JwtPayload {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    if (user.role === Role.STAFF && user.employee?.isActive)
      payload.position = user.employee.position.code;
    return payload;
  }

  private async issueTokens(user: UserEntity): Promise<AuthResponseDto> {
    const payload = this.buildPayload(user);
    const [accessToken, refreshToken] = await Promise.all([
      // Access token dùng secret + thời hạn mặc định của JwtModule (AuthModule)
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('REFRESH_JWT_SECRET_KEY', { infer: true }),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', { infer: true }),
        // jti để 2 refresh token cấp trong cùng 1 giây vẫn khác nhau
        jwtid: randomUUID(),
      }),
    ]);
    await this.userService.setRefreshTokenHash(user.id, sha256(refreshToken));
    return {
      accessToken,
      refreshToken,
      user: await this.userService.findById(user.id),
    };
  }
}
