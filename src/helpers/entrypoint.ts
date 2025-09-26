import type { Alpine } from 'alpinejs';
import displayCodeImg from '../utils/displayCodeImg';


export default (Alpine: Alpine) => {
  Alpine.data("displaycodeimg",displayCodeImg)
 
};