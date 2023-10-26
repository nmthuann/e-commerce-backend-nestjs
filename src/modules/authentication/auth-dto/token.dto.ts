export class TokensDto {
  access_token: string;
  refresh_token: string;

  toString() {
    return JSON.stringify({
      access_token: this.access_token,
      refresh_token: this.refresh_token,
    });
  }
}
