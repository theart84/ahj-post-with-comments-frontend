import templateEngine from './TemplateEngine';

export default class Comment {
  constructor(container, { id, author, avatar, content, created }) {
    this.container = container;
    this.id = id;
    this.author = author;
    this.avatar = avatar;
    this.content = content;
    this.created = created;
  }

  render() {
    this.container.insertAdjacentElement('afterbegin', templateEngine.generate(this.markup()));
  }

  markup() {
    const sourceDate = new Date(this.created);
    const date = `${sourceDate.toLocaleDateString()} ${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)}`;
    return {
      type: 'div',
      attr: {
        class: ['comment'],
        'data-comment-id': this.id,
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['comment__avatar'],
          },
          content: {
            type: 'img',
            attr: {
              src: this.avatar,
              alt: 'avatar',
            },
            content: '',
          },
        },
        {
          type: 'div',
          attr: {
            class: ['comment__body'],
          },
          content: [
            {
              type: 'div',
              attr: {
                class: ['comment__author'],
              },
              content: this.author,
            },
            {
              type: 'div',
              attr: {
                class: ['comment__content'],
              },
              content: this.content,
            },
          ],
        },
        {
          type: 'div',
          attr: {
            class: ['comment__date'],
          },
          content: date,
        },
      ],
    };
  }
}
