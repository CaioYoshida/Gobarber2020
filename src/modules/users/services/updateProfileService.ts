import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    userRepository: IUsersRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const emailMatchedUser = await this.usersRepository.findByEmail(email);

    if (emailMatchedUser && emailMatchedUser.id !== user_id) {
      throw new AppError('This e-mail is already used');
    }

    if (old_password) {
      const passwordMatch = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (passwordMatch && new_password) {
        user.password = await this.hashProvider.generateHash(new_password);
      } else {
        throw new AppError('Your old_password is wrong!');
      }
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
