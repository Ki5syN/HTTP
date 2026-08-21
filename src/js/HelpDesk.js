import TicketForm from './TicketForm';
import TicketView from './TicketView';
/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }

    this.container = container;
    this.ticketService = ticketService;
    this.ticketForm = new TicketForm();

    const list = container.querySelector('.list');
    this.ticketView = new TicketView(list);

    this.allTikets = [];
    this.idTiket = 0;

    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);

    this.container.addEventListener('click', this.onClick);
    this.container.addEventListener('submit', this.onSubmit);
    this.container.addEventListener('input', this.onInput);
  }

  init() {
    this.ticketService.list((tickets) => {
      this.allTikets = tickets;
      this.ticketView.render(tickets);
    });
  }

  async onClick(event) {
    if (event.target.classList.contains('addItem')) {
      this.idTiket = 0;
      this.ticketForm.render('new');
      return;
    }

    if (event.target.classList.contains('target')) {
      this.getTicket(event.target);
      const description = event.target.nextElementSibling;
      description.classList.toggle('hidden');
    }

    if (event.target.classList.contains('cancel')) {
      const popup = event.target.closest('.popup');
      const deleteBox = event.target.closest('.deleteBox');

      if (deleteBox) {
        this.ticketForm.removeDeleteForm();
        return;
      }

      if (popup.classList.contains('formPopup')) {
        this.idTiket = 0;
        this.ticketForm.reset();
        this.ticketForm.remove();
        return;
      }

      popup.remove();
    }

    if (event.target.classList.contains('edit')) {
      this.getTicket(event.target);

      this.ticketForm.updateForm(this.tiket);
      this.ticketForm.render('update');
    }

    if (event.target.classList.contains('delete')) {
      this.getTicket(event.target);

      this.ticketForm.render('delete');
    }

    if (event.target.classList.contains('ok')) {
      await this.ticketService.delete(this.idTiket);
      this.init();
      this.idTiket = 0;
      this.ticketForm.removeDeleteForm();
      return;
    }

    if (event.target.classList.contains('item-status')) {
      const isChecked = event.target.classList.toggle('checked');
      this.getTicket(event.target);

      await this.ticketService.update(this.idTiket, { status: isChecked });

      this.init();
    }
  }

  onInput(event) {
    if (event.target.closest('.formPopup')) event.target.setCustomValidity('');
  }

  getTicket(event) {
    const item = event.closest('.list-item');
    const nameTicket = item.querySelector('.target');
    const ticketEditName = nameTicket.textContent;

    this.tiket = this.allTikets.find((el) => el.name === ticketEditName);

    this.idTiket = this.tiket.id;
  }

  async onSubmit(event) {
    event.preventDefault();

    if (event.target.classList.contains('formPopup')) {
      const form = event.target;
      let isFormValid = true;

      [...form.elements].forEach((element) => {
        if (element.required && element.value.trim() === '') {
          element.setCustomValidity('Поле не может быть пустым!');
          isFormValid = false;
        } else {
          element.setCustomValidity('');
        }
      });

      if (!form.reportValidity() || !isFormValid) {
        return;
      }

      if (this.idTiket) {
        await this.ticketForm.sendUpdateTicket(this.idTiket);
        this.idTiket = 0;
      } else {
        await this.ticketForm.sendDataNewTicket();
      }

      this.init();
    }
  }
}
