/* eslint-disable camelcase */
import Comment from './Comment';
import templateEngine from './TemplateEngine';

export default class Post {
  constructor(container, { id, author_id, title, author, avatar, image, created, comments }) {
    this.container = container;
    this.id = id;
    this.author_id = author_id;
    this.title = title;
    this.author = author;
    this.avatar = avatar;
    this.image = image;
    this.created = created;
    this.comments = comments;
  }

  init() {
    this.render();
    this.addComments();
  }

  render() {
    this.container.insertAdjacentElement('afterbegin', templateEngine.generate(this.markup()));
    this.commentContainer = this.container
      .querySelector(`.post[data-post-id="${this.id}"]`)
      .querySelector('.post__comments');
  }

  addComments() {
    if (!this.comments) {
      return;
    }
    this.comments.forEach((comment) => {
      const newComment = new Comment(this.commentContainer, comment);
      newComment.render();
    });
  }

  markup() {
    const sourceDate = new Date(this.created);
    const date = `${sourceDate.toLocaleDateString()} ${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)}`;
    return {
      type: 'article',
      attr: {
        class: ['post'],
        'data-post-id': this.id,
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['post__header'],
          },
          content: [
            {
              type: 'div',
              attr: {
                class: ['post__avatar'],
              },
              content: {
                type: 'img',
                attr: {
                  src: this.avatar,
                  alt: 'avatar',
                },
              },
            },
            {
              type: 'div',
              attr: {
                class: ['post__userinfo'],
              },
              content: [
                {
                  type: 'div',
                  attr: {
                    class: ['post__author'],
                    'data-author-id': this.author_id,
                  },
                  content: this.author,
                },
                {
                  type: 'div',
                  attr: {
                    class: ['post__created'],
                  },
                  content: date,
                },
              ],
            },
          ],
        },
        {
          type: 'div',
          attr: {
            class: ['post__body'],
          },
          content: [
            {
              type: 'h2',
              attr: {
                class: ['post__title'],
                'data-author-id': this.author_id,
              },
              content: this.title,
            },
            {
              type: 'div',
              attr: {
                class: ['post__img-container'],
              },
              content: {
                type: 'img',
                attr: {
                  class: ['post__img'],
                  src: this.image,
                  alt: 'post_image',
                },
                content: '',
              },
            },
          ],
        },
        {
          type: 'div',
          attr: {
            class: ['post__footer'],
          },
          content: {
            type: 'div',
            attr: {
              class: ['post__comments'],
            },
            content: '',
          },
        },
      ],
    };
  }
}
