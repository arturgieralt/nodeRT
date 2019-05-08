import { Request, Response, NextFunction } from 'express';
import UserServiceInstance, { UserService } from './../services/UserService';
import MailService from './../mailer/MailService';
import { welcomeMail, accountActivated, accountRemoved } from './../mailer/templates';
import { getRolesPerUser } from './../services/RolesService';
import TokenServiceInstance, { TokenService } from './../services/TokenService/TokenService';
import { IUserModel } from 'models/IUserModel';
import { IVerifyToken } from 'services/TokenService/IVerifyToken';
import { VerifyAccount } from './../services/TokenService/TokenFactory';
import { IAuthToken } from 'services/TokenService/IAuthToken';

export class UserController {
  constructor(private UserService: UserService, private TokenService: TokenService) {
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const result = await this.UserService.getAll();
      return res.json(result || { message: 'OK' });
    } catch (error) {
      return res.status(500).json(error);
    }

  }
  
  getSingle = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const result = await this.UserService.getSingle(req.body.id);
      return res.json(result || { message: 'OK' });
    } catch (error) {
      return res.status(500).json(error);
    }

  }
  
  update = async (req: Request, res: Response, next: NextFunction) => {
    // validation here

    try {
      const { user }: {user?: IAuthToken} = req;
      const result = await this.UserService.update(user!.id, req.body);
      return res.json(result || { message: 'OK' });
    } catch (error) {
      return res.status(500).json(error);
    }
    
  }
  
  
  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  
    try {
      const { user }: {user?: IAuthToken} = req;
      const userData = await this.UserService.getUserProfile(user!.id)
      res.status(200).send(userData);
    } catch (e) {
      res.status(400).send({...e});
    }
  
  
  }
  
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, password, email } = req.body;  
    try {
      const user = await this.UserService.add(name, password, email);
      const token = await this.TokenService.createVerificationToken(user._id);
      MailService.sendMail(welcomeMail(user, token));
      res.status(200).send();
    } catch (e) {
      res.status(400).send({...e});
    }
  
  }
  
    verify = async (req: Request, res: Response, next: NextFunction) => {
    const { verifyToken: token } = req.body;
  
    try{
      const decoded: IVerifyToken = await this.TokenService
        .verifyToken(token, VerifyAccount);
      const user: IUserModel = await this.UserService.verify(decoded.id);
      await this.TokenService.blacklist(decoded.tokenId)
      MailService.sendMail(accountActivated(user));
      res.status(200).send();
    } catch(e) {
      res.status(400).send(e);
    }
  
  }
  
    login = async (req: Request, res: Response, next: NextFunction) => {
  
    try{
      const user: IUserModel = await this.UserService.authenticate(req, res, next);
      const roles = await getRolesPerUser(user.id);
      const { token, payload} = await this.TokenService.createToken(user, roles);
      const loginSuccess = await this.UserService.login(req, payload)
  
        if(loginSuccess) {
  
          res.status(200).send({ token })
        } else {
  
          this.TokenService.blacklist(payload.tokenId)
          res.status(401).send({message: 'Cannot log in'})
        }
      } catch(e) {
  
        res.status(400).json({ e });
      }
  }
  
  logout = (req: Request, res: Response) => {
    try {
      const { user }: {user?: IAuthToken} = req;
      this.TokenService.blacklist(user!.tokenId)
      req.logout();
      return res.status(200).send()
    }  catch(e) {
      return res.status(400).json(e);
    }
    
  }
  
  remove = async (req: Request, res: Response, next: NextFunction) => {
  
      try{
  
        const { user }: {user?: IAuthToken} = req;
        await this.TokenService.blacklistAllForUser(user!.id);
        await this.UserService.remove(user!.id);
        MailService.sendMail(accountRemoved(user));
        req.logout();
        res.status(200).send();  
      }
      catch(e) {
  
        res.status(400).send(e);
      }
  }

}
const ControllerInstance = new UserController(UserServiceInstance, TokenServiceInstance);

export default ControllerInstance;
