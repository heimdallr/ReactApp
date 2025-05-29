class Api {
  _baseUrl = "http://192.168.3.31:9080/";
  // _baseUrl = "/";

  async getResourse(url) {
    try {
      const res = await fetch(`${this._baseUrl}${url}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.log(err, "My error message");
    }
  }

  async getBlob(url) {
    try {
      const res = await fetch(`${this._baseUrl}${url}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`);
      }
      return await res.blob();
    } catch (err) {
      console.log(err, "My error message");
    }
  }

  async postData(url, data = []) {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(`${this._baseUrl}${url}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") {
        // обработать ошибку от вызова abort()
        return { color: "danger", message: "Нет ответа от сервера" };
      } else {
        console.log("My error message:", err);
      }
    }
  }
}

export default Api;
