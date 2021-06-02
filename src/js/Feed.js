import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import Post from './Post';
import templateEngine from './TemplateEngine';

export default class Feed {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
    this.subscribeOnStreams();
  }

  registerEvents() {}

  bindToDOM() {
    this.container.appendChild(templateEngine.generate(this.markup()));
    this.postContainer = this.container.querySelector('.feed__content');
  }

  subscribeOnStreams() {
    this.postStream$ = ajax
      .getJSON('https://ahj-post-with-comments.herokuapp.com/posts/latest')
      .pipe(
        switchMap((posts) => {
          const postsAndComments = posts.map((post) =>
            ajax
              .getJSON(
                `https://ahj-post-with-comments.herokuapp.com/posts/${post.id}/comments/latest`
              )
              .pipe(map((comments) => ({ ...post, comments })))
          );
          return forkJoin(postsAndComments);
        })
      )
      .subscribe(
        (posts) => posts.forEach((post) => this.addPost(post)),
        (err) => console.log(err)
      );
  }

  unSubscribeOnStreams() {
    this.postStream$.unsubscribe();
  }

  addPost(post) {
    const newPost = new Post(this.postContainer, post);
    newPost.init();
  }

  markup() {
    return {
      type: 'div',
      attr: {
        class: ['feed'],
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['feed__header'],
          },
          content: {
            type: 'h1',
            attr: {
              class: ['feed__title'],
            },
            content: 'My Feed',
          },
        },
        {
          type: 'div',
          attr: {
            class: ['feed__content'],
          },
          content: '',
        },
      ],
    };
  }
}
