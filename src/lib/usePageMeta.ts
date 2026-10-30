import { useEffect } from 'react';
import { BRAND_NAME } from '../config';

type PageMeta = {
  title: string;
  description: string;
};

// Sets the browser tab title and description for the current page. The title of the home
// page is the brand line itself, so it gets passed in whole and isn't suffixed.
export const usePageMeta = ({ title, description }: PageMeta) => {
  useEffect(() => {
    document.title = title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
};
