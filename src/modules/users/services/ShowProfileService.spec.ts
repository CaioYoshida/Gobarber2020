import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './showProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should NOT be able to show a non existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'aisajsijai',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to show an existing user', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const showedProfile = await showProfile.execute({
      user_id: userOne.id,
    });

    expect(showedProfile.email).toBe('johndoe@example.com');
  });
});
