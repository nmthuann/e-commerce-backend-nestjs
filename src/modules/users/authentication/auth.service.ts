// @Injectable()
// export class AuthService {
  
//   constructor(
//     private jwtService: JwtService,
//     private accountUserService: AccountUserService,
//   ) {}
  
//   //function hash password
//   private async hashPassword(password: string): Promise<string> {
//     //console.log(await bcrypt.hash(password, 10))
//     return await (bcrypt.hash(password, '12'));
//   }

//   //function compare password param with user password in database
//   private async comparePassword(
//     password: string,
//     storePasswordHash: string,
//     ): Promise<any> {
//     return await bcrypt.compare(password, storePasswordHash);
//   }

//   // function Middleware -> sẽ nằm ở API GateWay
//   private async authenToken(req: Request, res: Response, next: NextFunction) {
//     //const authorizationHeader = req.headers['authorization'];
//     const token = req.get('authorization').replace('Bearer', '').trim();
//     console.log(token)
//     if (!token) res.sendStatus(401);
//     const author = await this.jwtService.verifyAsync(token);
//     if (!author) {
//       console.log("Loi author!");
//       res.status(403);
//     }else{
//       console.log("Phan quyen thanh cong!"); 
//       next();
//     }
//   }

//   // gettoken -> [access,refresh] -> create sign
//   private async getTokens(payload: Payload): Promise<Tokens> {
//     const [jwt, refresh] = await Promise.all([
//       this.jwtService.signAsync({payload}, {
//           secret: 'JWT_SECRET_KEY',
//           expiresIn: 60*60,
//       }),
//       this.jwtService.signAsync({payload}, {
//           secret: 'REFRESH_JWT_SECRET_KEY',
//           expiresIn: 60 * 60 * 24,
//       })
//     ]);

//     return {
//       access_token: jwt,
//       refresh_token: refresh
//     }
//   }

//   // hàm random password
//   private randomPassword(length: number, base: string){
//     //const baseString = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
//     const getRandomInt = (min: number, max: number) => {
//       return Math.floor(Math.random() * (max - min)) + min;
//     };
//     let result = "";
//     const baseLength = base.length;
//     for (let i = 0; i < length; i++) {
//       const randomIndex = getRandomInt(0, baseLength);
//       result += base[randomIndex];
//     }
//     return result;
//   }
  
//   /**
//    *  ___________________________________________________________________________________
//    *  Controller có -> Service có!
//    * 
//    */

//   // đăng kí tài khoản -> Done!
//   public async registerUser(input: CreateAccountUserDto): Promise<AccessTokenDto | object> {
//     const checkUser = await this.accountUserService.getAccountUserByEmail(input.email);
//     if (checkUser) {
//       // throw new HttpException(
//       // { message: 'User already exists' },
//       //   HttpStatus.BAD_REQUEST,
//       // );
//       return {message: 'User already exists'}
//     }

//     input.password = await bcrypt.hash(input.password, 12); // hash pass

//     // create account
//     const newUser = await this.accountUserService.createAccountUser(input);

//     const tokens = await this.getTokens({
//       email: newUser.email,
//       role: Role.User
//     });

//     const update = new UpdateAccountUserDto(
//       newUser.email,
//       newUser.password,
//       tokens.refresh_token,
//       null
//     );

//     await this.accountUserService.updateAccountUser(newUser.email, update)
//     console.log(newUser);

//     //const accessTokenDto = new AccessTokenDto(tokens.access_token);
//     return tokens;
//   }






  
  

// }

