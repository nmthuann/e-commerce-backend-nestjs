import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { IAccountService } from 'src/modules/v1/modules/users/account/account.service.interface'
import { AccountDto } from 'src/modules/v1/modules/users/account/account-dto/account.dto'
import { AccountEntity } from 'src/modules/v1/modules/users/account/account.entity'
import { IAuthService } from './auth.service.interface'
import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import { IUserService } from '../users/user/user.service.interface'
import { IEmployeeService } from '../users/employee/Employee.service.interface'
import { UserEntity } from '../users/user/user.entity'
import { RegisterCustomerDto } from './dto/register-customer.dto'
import { TokensDto } from './dto/token.dto'
import { AuthDto } from './dto/auth.dto'
import { RegisterDto } from './dto/register.dto'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { LoginResponse } from './dto/responses/login.response'
import { LoginDto } from './dto/login.dto'
import { AuthExceptionMessages } from '../../constants/auth.error.enum'
import { ErrorInput, ErrorType, GuardError } from '../../constants/errors.enum'
import { Role } from '../../constants/role.enum'
import { AuthMessage } from '../../constants/auth.message.enum'
import { AuthMessages } from '../../constants/message.enum'
import { Payload } from '../../common/types/payload.type'
import { Tokens } from '../../common/types/token.type'
import { AuthException } from '../../exceptions/auth.exception'

dotenv.config()

const salary_employee = 280

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly jwtService: JwtService,
    @Inject('IAccountService')
    private readonly accountService: IAccountService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, '10')
  }

  private async comparePassword(password: string, storePasswordHash: string): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash)
  }

  private async getTokens(payload: Payload): Promise<Tokens> {
    const [jwt, refreshjwt] = await Promise.all([
      this.jwtService.signAsync(
        { payload },
        {
          secret: 'JWT_SECRET_KEY',
          expiresIn: 60 * 15
        }
      ),
      this.jwtService.signAsync(
        { payload },
        {
          secret: 'REFRESH_JWT_SECRET_KEY',
          expiresIn: 60 * 60 // 60 * 60 * 24
        }
      )
    ])

    return {
      accessToken: jwt,
      refreshToken: refreshjwt
    }
  }

  private randomPassword(length: number, base: string): string {
    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min)) + min
    }
    let result: string = ''
    const baseLength = base.length
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(0, baseLength)
      result += base[randomIndex]
    }
    return result
  }

  async register(data: RegisterDto): Promise<LoginResponse> {
    throw new Error('Method not implemented.')
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const findAccount: AccountEntity = await this.accountService.getOneById(data.email)
    // console.log(findUser)
    if (findAccount) {
      const checkPass = await this.comparePassword(data.password, findAccount.password)
      if (!checkPass) {
        console.log('password wrong!')
        throw new AuthException(AuthExceptionMessages.PASSWORD_WRONG)
        // return { message: AuthExceptionMessages.PASSWORD_WRONG };
      }
    } else {
      throw new AuthException(AuthExceptionMessages.LOGIN_INVAILD)
      // return { message: AuthExceptionMessages.LOGIN_INVAILD };
    }

    // write infor put in Payload
    const payload: Payload = {
      email: data.email,
      role: findAccount.role
    }

    const tokens: Tokens = await this.getTokens(payload)
    findAccount.refresh_token = tokens.refreshToken
    await this.accountService.updateOneById(findAccount.email, findAccount)

    const userInfo = await this.userService.getUserByEmail(data.email)

    return {
      accessToken: tokens.accessToken,
      firstName: userInfo.first_name,
      avatarUrl: userInfo.avatar_url,
      email: userInfo.account.email,
      lastName: userInfo.last_name,
      refreshToken: tokens.refreshToken
    }
  }

  public async registerCustomer(input: RegisterCustomerDto): Promise<TokensDto | object> {
    console.log('registerCustomer', input)
    const accountExists = await this.accountService.getOneById(input.email)

    if (accountExists) {
      // throw new Error
      return { message: ErrorInput.EMAIL_EXSIT } // Nếu email không tồn tại, ném ra lỗi NOT_FOUND
    }

    try {
      // hash pass
      input.password = await bcrypt.hash(input.password, 12)

      // create account
      const createAccount = await this.accountService.createOne({
        email: input.email,
        password: input.password
      })

      const tokens = await this.getTokens({
        email: createAccount.email,
        role: Role.User
      })

      const update = new AccountDto(
        createAccount.email,
        true,
        tokens.accessToken,
        createAccount.password,
        Role.User,
        null
      )

      const updateAccount: AccountEntity = await this.accountService.updateOneById(createAccount.email, update)
      console.log(createAccount)

      const createUser: UserEntity = await this.userService.createOne({
        first_name: input.first_name,
        last_name: input.last_name,
        avatar_url: '',
        gender: input.gender,
        birthday: input.birthday,
        address: '',
        phone: input.phone,
        account: updateAccount
      })

      return {
        access_token: tokens.accessToken,
        first_name: createUser.first_name
      }
    } catch (error) {
      console.log('ĐĂNG KÝ::::', error)
      throw new Error(ErrorType.NO_SUCCESS)
    }
  }

  // đăng nhập
  // public async login(input: AuthDto): Promise<Tokens | object | any> {

  // }

  // logout -> refresh token = null -> delete cache
  public async logout(email: string): Promise<boolean> {
    const checkUser = await this.accountService.getOneById(email)
    checkUser.refresh_token = null
    await this.accountService.updateOneById(checkUser.email, checkUser)
    console.log(`${email} da dang xuat!`)
    return true
  }

  // đăng kí tài khoản -> Done!
  public async registerEmployee(input: RegisterDto): Promise<AccountEntity> {
    //TokensDto | object
    let newUser: AccountEntity
    try {
      // hash pass
      input.password = await bcrypt.hash(input.password, 12)

      // create account
      newUser = await this.accountService.createOne(input)

      const tokens = await this.getTokens({
        email: newUser.email,
        role: Role.Admin
      })

      const updateAccount = new AccountEntity()
      updateAccount.email = newUser.email
      updateAccount.password = newUser.password
      updateAccount.refresh_token = tokens.refreshToken
      updateAccount.role = Role.Admin
      updateAccount.status = true
      updateAccount.user = null

      const createdAccount: AccountEntity = await this.accountService.updateOneById(newUser.email, updateAccount)
      // console.log(newUser);

      //const accessTokenDto = new AccessTokenDto(tokens.access_token);
      return createdAccount
    } catch (error) {
      console.log(`Có lỗi Đăng ký nhân viên :::: ${error} `)
      // Nếu có lỗi, xóa tài khoản đã tạo (nếu đã tạo)
      if (newUser) {
        // Thực hiện xóa tài khoản tại đây
        await this.accountService.deleteAccountFail(newUser.email)
      }
      throw new AuthException(AuthExceptionMessages.REGISTER_EMPLOYEE_FAILED)
    }
  }

  // đăng nhập  - chưa fix
  public async loginAdmin(input: AuthDto): Promise<Tokens | object | any> {
    const findUser: AccountDto = await this.accountService.getOneById(input.email)

    if (findUser === null) {
      return { message: AuthExceptionMessages.LOGIN_INVAILD }
    }
    if (findUser.role === Role.User) {
      return { message: GuardError.NOT_ADMIN }
    }
    if (findUser) {
      const checkPass = await this.comparePassword(input.password, findUser.password)
      console.log('checkPass', checkPass)
      if (!checkPass) {
        console.log('password wrong!')
        return { message: AuthExceptionMessages.PASSWORD_WRONG }
      }
    } else {
      return { message: AuthExceptionMessages.LOGIN_FAILED }
    }

    // write infor put in Payload
    const payload: Payload = {
      email: input.email,
      role: findUser.role
    }

    const tokens: Tokens = await this.getTokens(payload)
    findUser.refresh_token = tokens.refreshToken
    await this.accountService.updateOneById(findUser.email, findUser)

    const userInfo = await this.userService.getUserByEmail(input.email)
    const positionInfo = await this.userService.getEmployeeByEmail(input.email)

    //return tokens;

    console.log({
      access_token: tokens.refreshToken,
      first_name: userInfo.first_name,
      avatar_url: userInfo.avatar_url,
      position: (await Promise.resolve(positionInfo.position)).position_id // mã chức vụ
    })
    return {
      access_token: tokens.accessToken,
      first_name: userInfo.first_name,
      avatar_url: userInfo.avatar_url,
      position: (await Promise.resolve(positionInfo.position)).position_id // mã chức vụ
    }
  }

  async verifyEmail(email: string): Promise<string | any> {
    const checkUser = await this.accountService.getOneById(email)
    if (checkUser) {
      return { message: AuthExceptionMessages.EMAIL_EXIST }
    } else {
      // return {message: AuthMessage.SEND_MAIL_SUCCESS};

      try {
        const baseString = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        const defaulPassword = this.randomPassword(8, baseString)
        const receiver = email
        const subject = AuthMessage.SUBJECT_REGISTER_EMAIL
        const content = `${AuthMessage.CONTENT_REGISTER_EMAIL}: ${defaulPassword}`

        //  Send Mailer -> Success
        const resultSendMail = await this.sendMail(receiver, subject, content)

        if (resultSendMail.message === AuthMessage.SEND_MAIL_SUCCESS) {
          // create account
          const data = new RegisterDto()
          data.email = email
          data.password = defaulPassword
          data.firstName = 'true'
          data.lastName = 'Role.User'
          data.avatarUrl = ''
          return await this.registerEmployee(data) // hash pass
        }

        // return resultSendMail;
      } catch (error) {
        throw new AuthException(AuthExceptionMessages.VERIFY_MAIL_FAILED)
      }
    }
  }

  async sendMail(receiver: string, subject: string, content: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      })

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: receiver,
        subject: subject,
        text: content
      }
      await transporter.sendMail(mailOptions)
      return { message: AuthMessage.SEND_MAIL_SUCCESS }
    } catch (error) {
      // Xử lý lỗi ở đây, ví dụ: ghi log lỗi hoặc thông báo cho người dùng.
      console.error('Gửi email thất bại:', error)
      throw new AuthException(AuthExceptionMessages.SEND_MAIL_FAILED)
    }
  }

  async createEmployee(email: string, position_id: number, data: CreateEmployeeDto) {
    try {
      // Kiểm tra xem email đã tồn tại trong hệ thống chưa
      const accountExists = await this.accountService.getOneById(email)

      if (!accountExists) {
        return { message: ErrorInput.EMAIL_NOT_FOUND } // Nếu email không tồn tại, ném ra lỗi NOT_FOUND
      }

      // Tạo một người dùng mới
      const newUser = await this.userService.createOne({
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        birthday: data.birthday,
        address: data.address,
        phone: data.phone,
        avatar_url: data.avatar_url || '',
        account: email
      })
      console.log(newUser)
      if (!newUser) {
        return { message: ErrorType.NO_SUCCESS }
      } else {
        const createNewEmployee = await this.employeeService.createNewEmployee(email, {
          employee_id: data.employee_id,
          salary: salary_employee,
          work_status: true,
          position_id
        })
        console.log('createNewEmployee', createNewEmployee)
      }

      // Tạo một nhân viên mới và liên kết với người dùng

      return { message: AuthMessages.CREATE_EMPLOYEE_SUCCESS } // Trả về kết quả thành công
    } catch (error) {
      // Xử lý lỗi cụ thể nếu có lỗi xảy ra
      console.log(error)
      if (error.message === ErrorType.NOT_FOUND) {
        throw new Error(ErrorType.NOT_FOUND)
      } else {
        throw new Error(ErrorType.NO_SUCCESS)
      }
    }
  }
}

// async checkOTP (otp: string){
//     // == in cache
//     try {
//         const emailInCache: string = await this.cacheService.get(String(otp));
//         if (emailInCache){ // đúng
//             await this.cacheService.del(String(otp));  // xóa cache

//             return {
//                 message: "success",
//                 email: String(emailInCache)
//             }
//         }
//         else{
//             await this.cacheService.del(String(otp));
//             return {message: "failed"}
//         }

//     } catch (error) {
//         throw new Error(`An unexpected error:: ${error}`);
//     }
// }

// async verifyEmail(email: string): Promise<string | any>{
//     try {
//          const checkUser = await this.accountService.getOneById(email);
//         if (checkUser) {
//             return {message: 'User already exists'};
//         }
//         const baseString ="0123456789qwertyuiopasdfghjklzxcvbnm";
//         const otp = this.randomPassword(6, baseString)
//         console.log(`OTP: ${otp}`);
//         // lưu cache
//         await this.cacheService.set(String(otp), String(email), 300); // 5phut
//         return email;
//     } catch (error) {
//         throw error
//     }
// }

//     // write infor put in Payload
//     const payload: Payload = {
//         email: input.email,
//         role: findUser.role
//     };

//     const tokens: Tokens = await this.getTokens(payload);
//     findUser.refresh_token = tokens.refresh_token;
//     await this.accountService.updateOneById(findUser.email, findUser);
//     console.log(`message: ${input.email} đăng nhập thành công!`)
//     return tokens;
// }
