import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailabilityService from './listProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const schedule = Array.from({ length: 10 }, (_, index) => index + 8);

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 19, 8, 0, 0),
    });

    Promise.all(
      schedule.map(async each => {
        return fakeAppointmentsRepository.create({
          provider_id: 'user',
          date: new Date(2020, 4, 20, each, 0, 0),
        });
      }),
    );

    Promise.all(
      schedule.map(async each => {
        return fakeAppointmentsRepository.create({
          provider_id: 'user',
          date: new Date(2020, 4, 21, each, 0, 0),
        });
      }),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 22, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
      ]),
    );
  });
});
