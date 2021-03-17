import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from './listProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProviderService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProviderService(fakeUsersRepository);
  });

  it('should NOT be able to show a non existing user', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'John Tompson',
      email: 'johntompson@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Mac',
      email: 'johnmac@example.com',
      password: '123456',
    });

    const users = await listProviders.execute({ user_id: loggedUser.id });

    expect(users).toHaveLength(2);
    expect(users).toEqual([user1, user2]);
  });
});
