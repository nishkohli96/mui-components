import { type Page } from '@/types';

export const sidebarLinks: Page[] = [
  {
    title: 'MUI',
    pages: [
      { title: 'Text Field', href: '/mui/textfield' },
      { title: 'Password Input', href: '/mui/password-input' },
      { title: 'Number Input', href: '/mui/number-input' },
      { title: 'Tags Input', href: '/mui/tags-input' },
      { title: 'File Uploader', href: '/mui/file-uploader' },
      { title: 'Select', href: '/mui/select' },
      { title: 'Native Select', href: '/mui/native-select' },
      { title: 'Autocomplete', href: '/mui/autocomplete' },
      { title: 'Autocomplete Object', href: '/mui/autocomplete-object' },
      { title: 'Country Select', href: '/mui/country-select' },
      { title: 'Multi Autocomplete', href: '/mui/multi-autocomplete' },
      { title: 'Multi Autocomplete Object', href: '/mui/multi-autocomplete-object' },
      { title: 'Checkbox', href: '/mui/checkbox' },
      { title: 'Checkbox Group', href: '/mui/checkbox-group' },
      { title: 'Radio Group', href: '/mui/radio-group' },
      { title: 'Slider', href: '/mui/slider' },
      { title: 'Switch', href: '/mui/switch' },
      { title: 'Rating', href: '/mui/rating' }
    ]
  },
  {
    title: 'MUI Pickers',
    pages: [
      { title: 'Date Picker', href: '/mui-pickers/date' },
      { title: 'Time Picker', href: '/mui-pickers/time' },
      { title: 'Date Time Picker', href: '/mui-pickers/date-time' }
    ]
  },
  {
    title: 'Misc',
    pages: [
      { title: 'Color Picker', href: '/misc/color-picker' },
      { title: 'Rich Text Editor', href: '/misc/rich-text-editor' },
      { title: 'Phone Input', href: '/misc/phone-input' }
    ]
  },
  {
    title: 'Customization',
    href: '/customization'
  },
  {
    title: 'Complete Forms',
    pages: [
      { title: 'React State', href: '/complete-forms/react-state' },
      { title: 'React Hook Form', href: '/complete-forms/react-hook-form' },
      { title: 'Formik', href: '/complete-forms/formik' },
      { title: 'TanStack', href: '/complete-forms/tanstack' }
    ]
  }
];
