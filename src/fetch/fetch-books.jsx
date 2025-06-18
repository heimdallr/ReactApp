import Api from "./api";
export default class FetchBooks {
  apiData = new Api();

  getConfig = async () => {
    return await this.apiData.getResourse(`main/getBooks/getConfig`);
  };

  getSearchStats = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchStats?search=${search}&selectedGroupID=${selectedGroupID}`
    );
  };

  getSearchAuthors = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchAuthors?search=${search}&selectedGroupID=${selectedGroupID}`
    );
  };

  getSearchAuthorBooks = async ({ selectedItemID, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchAuthorBooks?selectedItemID=${selectedItemID}&selectedGroupID=${selectedGroupID}`
    );
  };

  getSearchSeries = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchSeries?search=${search}&selectedGroupID=${selectedGroupID}`
    );
  };

  getSearchSeriesBooks = async ({ selectedItemID, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchSeriesBooks?selectedItemID=${selectedItemID}&selectedGroupID=${selectedGroupID}`
    );
  };

  getSearchTitles = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchTitles?search=${search}&selectedGroupID=${selectedGroupID}`
    );
  };

  getBookForm = async ({ selectedItemID }) => {
    return await this.apiData.getResourse(`main/getBooks/getBookForm?selectedItemID=${selectedItemID}`);
  };

  getBook = async ({ BookID }) => {
    return await this.apiData.getText(`Images/fb2/${BookID}`);
  };

  getCover = async ({ BookID }) => {
    return await this.apiData.getBlob(`Images/covers/${BookID}`);
  };
}
