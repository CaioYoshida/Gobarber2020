import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../../../shared/errors/AppError';

import User from '../entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const duplicatedEmail = await usersRepository.findOne({
      where: { email },
    });

    if (duplicatedEmail) {
      throw new AppError('Email address is already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
