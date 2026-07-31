import TicketService from './TicketService';
/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor() {
    this.ticketService = new TicketService();

    this.createForm('new');
    this.allTicket = [];
  }

  createForm(status) {
    const form = document.createElement('form');
    form.classList.add('popup', 'formPopup');

    const header = document.createElement('h3');
    header.classList.add('popup-header');
    if (status === 'new') {
      header.textContent = 'Добавить тикет';
    }

    if (status === 'update') {
      header.textContent = 'Изменить тикет';
    }

    const labelTarget = document.createElement('label');
    labelTarget.htmlFor = 'shortNameId';
    labelTarget.textContent = 'Краткое описание';

    const inputTarget = document.createElement('input');
    inputTarget.classList.add('popup-shortName');
    inputTarget.id = 'shortNameId';
    inputTarget.name = 'name';

    const labelDescription = document.createElement('label');
    labelDescription.htmlFor = 'descriptionId';
    labelDescription.textContent = 'Подробное описание';

    const inputDescription = document.createElement('textarea');
    inputDescription.classList.add('popup-description');
    inputDescription.id = 'descriptionId';
    inputDescription.name = 'description';

    const boxBtn = document.createElement('div');
    boxBtn.classList.add('popup-btn-box');

    const btnCancel = document.createElement('button');
    btnCancel.classList.add('popup-btn', 'cancel');
    btnCancel.type = 'button';
    btnCancel.textContent = 'Отменить';

    const btnSave = document.createElement('button');
    btnSave.classList.add('popup-btn', 'save');
    btnSave.textContent = 'Сохранить';

    boxBtn.append(btnCancel, btnSave);
    form.append(header, labelTarget, inputTarget, labelDescription, inputDescription, boxBtn);

    this.form = form;
  }

  deleteForm() {}

  render(status) {
    const widget = document.getElementById('root');
    if (status === 'new' || 'update') {
      widget.append(this.form);
    }
    if (status === 'delete') {
      widget.append(this.deleteForm);
    }
  }

  getData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    return data;
  }

  reset() {
    this.form.reset();
  }

  remove() {
    this.form.remove();
  }

  sendDataNewTicket() {
    const dataforSend = this.getData(this.form);
    const newTicket = this.ticketService.create(dataforSend, (error, newTicket) => {
      if (error) {
        console.log(`Ошибка при создании тикета: ${error.message}`);
        return;
      }

      this.reset();
      this.remove();
    });
  }

  updateForm(data) {
    this.createForm('update');

    this.form.elements.name.value = data.name;
    this.form.elements.description.value = data.description || '';
  }

  sendUpdateTicket(data) {
    this.updateId = data.id;

    const dataforSend = this.getData(this.form);

    const updateTicket = this.ticketService.update(this.updateId, dataforSend, (error, newTicket) => {
      if (error) {
        console.log(`Ошибка при создании тикета: ${error.message}`);
        return;
      }

      this.reset();
      this.remove();
      this.updateId = null;
    });
  }
}
