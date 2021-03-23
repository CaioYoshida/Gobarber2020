import { ObjectID } from 'mongodb';

import INotiticatiosRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificaitonDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotiticatiosRepository {
  private notifications: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificaitonDTO): Promise<Notification> {
    const newNotification = new Notification();

    Object.assign(newNotification, {
      id: new ObjectID(),
      recipient_id,
      content,
    });

    this.notifications.push(newNotification);

    return newNotification;
  }
}

export default FakeNotificationsRepository;
