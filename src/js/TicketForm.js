import TicketService from './TicketService';
/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor() {
    this.ticketService = new TicketService();
    this.widget = document.getElementById('root');

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
    inputTarget.required = true;
    inputTarget.name = 'name';

    const labelDescription = document.createElement('label');
    labelDescription.htmlFor = 'descriptionId';
    labelDescription.textContent = 'Подробное описание';

    const inputDescription = document.createElement('textarea');
    inputDescription.classList.add('popup-description');
    inputDescription.id = 'descriptionId';
    inputDescription.required = true;
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

  deleteForm() {
    this.deleteBoxInformation = document.createElement('div');
    this.deleteBoxInformation.classList.add('deleteBox');

    const deleteHeader = document.createElement('h3');
    deleteHeader.classList.add('deleteBox-header');
    deleteHeader.textContent = 'Удалить тикет';

    const deleteText = document.createElement('span');
    deleteText.classList.add('deleteBox-text');
    deleteText.textContent = 'Вы уверены что хотите удалить тикет? Это действие необратимо?';

    const deleteBtnBox = document.createElement('div');
    deleteBtnBox.classList.add('deleteBox-btnBox');

    const deleteButtonCancel = document.createElement('button');
    deleteButtonCancel.classList.add('deleteBox-btn', 'cancel');
    deleteButtonCancel.textContent = 'Отмена';

    const deleteButtonApprove = document.createElement('button');
    deleteButtonApprove.classList.add('deleteBox-btn', 'ok');
    deleteButtonApprove.textContent = 'Ок';

    deleteBtnBox.append(deleteButtonCancel, deleteButtonApprove);
    this.deleteBoxInformation.append(deleteHeader, deleteText, deleteBtnBox);

    return this.deleteBoxInformation;
  }

  render(status) {
    this.widget = document.getElementById('root');
    if (status === 'new' || status === 'update') {
      this.widget.append(this.form);
    }
    if (status === 'delete') {
      this.widget.append(this.deleteForm());
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

  removeDeleteForm() {
    this.deleteBoxInformation.remove();
  }

  async sendDataNewTicket() {
    const dataforSend = this.getData(this.form);
    const newTicket = await this.ticketService.create(dataforSend);

    this.reset();
    this.remove();
    return newTicket;
  }

  updateForm(data) {
    this.createForm('update');

    this.form.elements.name.value = data.name;
    this.form.elements.description.value = data.description || '';
  }

  async sendUpdateTicket(id) {
    const dataforSend = this.getData(this.form);

    const updatedTicket = await this.ticketService.update(id, dataforSend);

    this.reset();
    this.remove();
    this.updateId = null;
    return updatedTicket;
  }
}
