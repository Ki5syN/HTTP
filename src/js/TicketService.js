/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    // Определяем базовый URL в зависимости от окружения
    this.baseUrl = this.getBaseUrl();
    console.log('🌐 API URL:', this.baseUrl);
  }

  getBaseUrl() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
      return 'http://localhost:7071';
    } else {
      return 'https://http-for-backend.onrender.com';
    }
  }

  async list(callback) {
    try {
      const response = await fetch(`${this.baseUrl}/?method=allTickets`);
      if (!response.ok) {
        throw new Error(`Ошибка сервера, статус: ${response.status}`);
      }
      const tickets = await response.json();
      callback(tickets);
    } catch (error) {
      console.error('Произошла ошибка при загрузке данных:', error.message);
    }
  }

  async get(id, callback) {
    try {
      const response = await fetch(`${this.baseUrl}/?method=ticketById&id=${id}`);
      if (!response.ok) {
        throw new Error(`Ошибка сервера, статус: ${response.status}`);
      }
      const ticket = await response.json();
      callback(ticket);
    } catch (error) {
      console.error('Произошла ошибка при загрузке данных:', error.message);
    }
  }

  async create(data, callback) {
    try {
      const response = await fetch(`${this.baseUrl}/?method=createTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера, статус: ${response.status}`);
      }
      const newTicket = await response.json();
      if (callback) callback(newTicket);
      return newTicket;
    } catch (error) {
      console.error('Произошла ошибка при создании тикета:', error.message);
    }
  }

  async update(id, data, callback) {
    try {
      const response = await fetch(`${this.baseUrl}/?method=updateById&id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера, статус: ${response.status}`);
      }
      const updatedTicket = await response.json();
      if (callback) callback(updatedTicket);
      return updatedTicket;
    } catch (error) {
      console.error('Произошла ошибка при обновлении тикета:', error.message);
    }
  }

  async delete(id, callback) {
    try {
      const response = await fetch(`${this.baseUrl}/?method=deleteById&id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера, статус: ${response.status}`);
      }

      if (callback) callback();
      return true;
    } catch (error) {
      console.error('Произошла ошибка при удалении тикета:', error.message);
    }
  }
}
