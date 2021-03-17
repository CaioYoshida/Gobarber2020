import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './updateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should NOT be able to update a non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'aisajsijai',
        name: 'John Doe Junior',
        email: 'johndoejunior@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update profile', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: userOne.id,
      name: 'John Doe Junior',
      email: 'johndoejunior@example.com',
    });

    expect(updatedUser.name).toBe('John Doe Junior');
    expect(updatedUser.email).toBe('johndoejunior@example.com');
  });

  it('should NOT be able to update its email with another which already exists on database', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userTwo = await fakeUsersRepository.create({
      name: 'James Collin',
      email: 'jamescollin@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: userTwo.id,
        name: userTwo.name,
        email: userOne.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should declare its old password to reset it', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: userOne.id,
      name: userOne.name,
      email: userOne.email,
      old_password: userOne.password,
      new_password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should NOT be able to reset password if old password does not match', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: userOne.id,
        name: userOne.name,
        email: userOne.email,
        old_password: '1234567',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
