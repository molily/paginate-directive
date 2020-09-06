import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

interface ItemContext<T> {
  $implicit: T;
}

interface ControlsContext {
  page: number;
  pages: number;
  previousPage(): void;
  nextPage(): void;
}

@Directive({
  selector: '[appPaginate]',
})
export class PaginateDirective<T> implements OnChanges {
  @Input()
  public appPaginateOf: T[] = [];

  @Input()
  public appPaginatePerPage = 10;

  @Input()
  public appPaginateControls?: TemplateRef<ControlsContext>;

  private page = 1;
  private pages = 1;

  constructor(
    private templateRef: TemplateRef<ItemContext<T>>,
    private viewContainerRef: ViewContainerRef
  ) {}

  public ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    this.viewContainerRef.clear();

    const { page } = this;
    const list = this.appPaginateOf;
    const perPage = this.appPaginatePerPage;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    for (let i = startIndex; i < list.length && i < endIndex; i++) {
      const itemContext: ItemContext<T> = { $implicit: list[i] };
      this.viewContainerRef.createEmbeddedView(this.templateRef, itemContext);
    }

    const totalLength = list.length;
    const pages = totalLength === 0 ? 1 : Math.ceil(totalLength / perPage);
    this.pages = pages;

    if (this.appPaginateControls) {
      const controlsContext: ControlsContext = {
        page,
        pages,
        previousPage: () => {
          this.previousPage();
        },
        nextPage: () => {
          this.nextPage();
        },
      };
      this.viewContainerRef.createEmbeddedView(
        this.appPaginateControls,
        controlsContext
      );
    }
  }

  private previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.render();
    }
  }

  private nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.render();
    }
  }
}
