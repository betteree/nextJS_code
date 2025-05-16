// import 'server-only';
import en from '@/components/dictionaries/en.json';
import ko from '@/components/dictionaries/ko.json';

export const getDictionary = (locale : 'ko' | 'en') => {
  if (locale === 'ko') {
    return ko;
  } else {
    return en;
  }
};
