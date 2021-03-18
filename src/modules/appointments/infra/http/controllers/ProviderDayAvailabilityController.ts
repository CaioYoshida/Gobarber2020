import { Request, Response } from 'express';
import { container } from 'tsyringe';

import listProviderDayAvailabilityService from '@modules/appointments/services/listProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.body;

    const listProviderDayAvailability = container.resolve(
      listProviderDayAvailabilityService,
    );

    const dayAvailability = await listProviderDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(dayAvailability);
  }
}
