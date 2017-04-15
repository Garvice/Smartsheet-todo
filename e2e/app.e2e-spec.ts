import { SmartsheetTodoPage } from './app.po';

describe('smartsheet-todo App', () => {
  let page: SmartsheetTodoPage;

  beforeEach(() => {
    page = new SmartsheetTodoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
