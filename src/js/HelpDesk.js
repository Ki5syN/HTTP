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

    this.onClick.bind(this);

    this.container.addEventListener('click', this.onClick.bind(this));
    // this.container.addEventListener('submit', onSubmit);
  }

  init() {
    this.ticketService.list((tickets) => {
      this.allTikets = tickets;
      console.log(this.allTickets);
      this.ticketView.render(tickets);
    });
  }

  async onClick(event) {
    if (event.target.classList.contains('addItem')) {
      this.ticketForm.render('new');
      return;
    }

    if (event.target.classList.contains('cancel')) {
      const popup = event.target.closest('.popup');
      if (popup.classList.contains('formPopup')) {
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

      return;
    }

    if (event.target.classList.contains('delete')) {
      this.getTicket(event.target);

      await this.ticketService.delete(this.idTiket);
      this.init();
    }

    if (event.target.classList.contains('item-status')) {
      const isChecked = event.target.classList.toggle('checked');
      this.getTicket(event.target);

      await this.ticketService.update(this.idTiket, { status: isChecked });

      this.init();
    }

    if (event.target.classList.contains('save')) {
      if (this.idTiket) {
        await this.ticketForm.sendUpdateTicket(this.idTiket);
        this.idTiket = 0;
      } else {
        await this.ticketForm.sendDataNewTicket();
      }

      this.init();
    }
  }
  getTicket(event) {
    const item = event.closest('.list-item');
    const nameTicket = item.querySelector('.target');
    const ticketEditName = nameTicket.textContent;

    this.tiket = this.allTikets.find((el) => el.name === ticketEditName);

    this.idTiket = this.tiket.id;
  }
}
