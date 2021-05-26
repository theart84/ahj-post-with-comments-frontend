import { switchMap } from 'rxjs/operators';
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
      .getJSON('http://localhost:3000/posts/latest')
      .pipe(
        switchMap(async (posts) =>
          Promise.all(
            posts.map(async (post) => {
              const request = await fetch(`http://localhost:3000/posts/${post.id}/comments/latest`);
              const response = await request.json();
              return { ...post, comments: response };
            })
          )
        )
      )
      .subscribe(
        (posts) => posts.forEach((post) => this.addPost(post)),
        (err) => console.log(err)
      );
  }

  // Вариант подписка в подписке...(плохой вариант:))
  // subscribeOnStreams() {
  //   this.postStream$ = ajax.getJSON('http://localhost:3000/posts/latest').subscribe((response) => {
  //     response.forEach((post) => {
  //       ajax
  //         .getJSON(`http://localhost:3000/posts/${post.id}/comments/latest`)
  //         .pipe(map((data) => ({ ...post, comments: data })))
  //         .subscribe((post) => this.addPost(post));
  //     });
  //   });
  // }

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
