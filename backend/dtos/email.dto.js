// dtos/email.dto.js
export default class EmailDTO {
  constructor({ emailId, subject, from, to, date, snippet, threadId }) {
    this.emailId = emailId;
    this.subject = subject;
    this.from = from;
    this.to = to;
    this.date = date;
    this.snippet = snippet;
    this.threadId = threadId;
  }
}