import TicketService from './TicketService';
/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(element) {
    if (!element) {
      throw new Error('Element not found');
    }

    this.element = element;
    this.ticketService = new TicketService();
  }

  createTargetItem(ticketName, ticketDiscription, status, created) {
    const item = document.createElement('li');
    item.classList.add('list-item');

    const itemStatus = document.createElement('div');
    itemStatus.classList.add('item-status');
    if (status) itemStatus.classList.add('checked');

    const itemInfo = document.createElement('div');
    itemInfo.classList.add('item-info');

    const targetBox = document.createElement('div');
    targetBox.classList.add('targetBox');

    const target = document.createElement('span');
    target.classList.add('target');
    target.textContent = ticketName;

    const fullTarget = document.createElement('span');
    fullTarget.classList.add('description', 'hidden');
    fullTarget.textContent = ticketDiscription;

    const ticketDate = document.createElement('time');
    ticketDate.classList.add('ticket-date');
    const dateCreate = new Date(created);
    const fullDate = dateCreate.toLocaleString('ru-RU', {
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    ticketDate.textContent = fullDate.replace(',', '.');

    const btnBox = document.createElement('div');
    btnBox.classList.add('btn-box');

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'edit');

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'delete');

    btnBox.append(btnEdit, btnDelete);
    targetBox.append(target, fullTarget);
    itemInfo.append(targetBox, ticketDate);
    item.append(itemStatus, itemInfo, btnBox);
    this.element.append(item);
  }

  render(allTicket) {
    this.element.innerHTML = '';

    if (!allTicket || allTicket.length === 0) return;

    allTicket.forEach((el) => {
      const { description, name, status, created } = el;

      this.createTargetItem(name, description, status, created);
    });
  }
}
