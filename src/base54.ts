export class Base54 {
  freq = Object.create(null);
  digits: string[];
  leading: string[];
  chars;
  frequency;

  init(chars: string) {
    let array: string[] = [];
    for (let i = 0; i < chars.length; i++) {
      let ch = chars[i];
      array.push(ch);
      this.freq[ch] = -1e-2 * i;
    }
    return array;
  }

  constructor() {
    this.digits = this.init('0123456789');
    this.leading = this.init('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_');
    this.reset();
    this.sort();
  }

  reset() {
    this.chars = null;
    this.frequency = Object.create(this.freq);
  }

  identifier(num: number) {
    let ret = this.leading[num % 54];
    for (num = Math.floor(num / 54); --num >= 0; num >>= 6) {
      ret += this.chars[num & 0x3f];
    }
    return ret;
  }

  consider(str, delta) {
    for (let i = str.length; --i >= 0; ) {
      this.frequency[str[i]] += delta;
    }
  }

  compare = (a, b) => {
    return this.frequency[b] - this.frequency[a];
  };

  sort() {
    this.chars = this.leading.sort(this.compare).concat(this.digits).sort(this.compare);
  }
}
