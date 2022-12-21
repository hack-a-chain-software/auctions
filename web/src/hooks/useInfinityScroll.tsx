import { createRef, RefObject, useEffect } from 'react';

/**
 * Infinity scroll, its calls fetch to load more data as soon as the trigger is achieved
 * @param trigger number The percentage value of scrolled to trigger fetch
 * @param fetch function The function to be called to fetch more data
 * @param loading boolean When the fetch function was called and its loading
 * @return { reference } RefObject<HTMLElement> The reference to the container to be scrolled */
export const useInfinityScroll: (
  trigger: number,
  fetch: () => void,
  loading: boolean
) => {
  reference: RefObject<HTMLElement>
} = (trigger, fetch, loading) => {
  const element = createRef<HTMLElement>();

  useEffect(() => {
    if(!element.current)
      return;
    element.current.addEventListener("scroll", onScroll);

    return () => {
      if(!element.current)
        return;
      element.current.removeEventListener("scroll", onScroll);
    }
  }, [element]);

  function onScroll(event: Event) {
    if(!event.target || !(event.target instanceof HTMLUListElement))
      return;

    const height = event.target.scrollHeight - event.target.clientHeight;
    const scroll = event.target.scrollTop;

    if(scroll * 100 / height > trigger && !loading)
      fetch();
  }

  return { reference: element };
}