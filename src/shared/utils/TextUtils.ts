import validator from "validator";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
const { window } = new JSDOM("<!DOCTYPE html>");
const domPurify = DOMPurify(window);

export class TextUtils {
  static sanitize(unsafeText: string): string {
    return domPurify.sanitize(unsafeText);
  }

  static validateWebURL(url: string): boolean {
    return validator.isURL(url);
  }

  static validateEmailAddress(email: string): boolean {
    const regExp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
  }

  static createRandomNumericString(numberDigits: number): string {
    const chars = "0123456789";
    let value = "";

    for (let i = numberDigits; i > 0; --i) {
      value += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return value;
  }

  static toNumber(text: string | any): number {
    if (text instanceof Number) {
      return text as number;
    }
    return parseInt(text, 10);
  }
}
