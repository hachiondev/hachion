import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGeoKeywordsByCourse = (courseName) => {
  return useQuery({
    queryKey: ['geoKeywords', courseName],
    queryFn: async () => {
      if (!courseName) return [];
      const res = await axios.get(
        'https://api.test.hachion.co/api/admin/geo-keywords/by-course',
        { params: { courseName } }
      );
      return res.data?.geoKeywords || [];
    },
    enabled: !!courseName
  });
};
