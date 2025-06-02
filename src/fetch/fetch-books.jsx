import Api from "./api";
export default class FetchBooks {
  apiData = new Api();

  getConfig = async () => {
    return await this.apiData.getResourse(`main/getBooks/getConfig`);
  };

  getSearchStats = async ({ search }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchStats?search=${search}`);
  };

  getSearchAuthors = async ({ search }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchAuthors?search=${search}`);
  };

  getSearchAuthorBooks = async ({ selectedItemID }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchAuthorBooks?selectedItemID=${selectedItemID}`);
  };

  getSearchSeries = async ({ search }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchSeries?search=${search}`);
  };

  getSearchSeriesBooks = async ({ selectedItemID }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchSeriesBooks?selectedItemID=${selectedItemID}`);
  };

  getSearchTitles = async ({ search }) => {
    return await this.apiData.getResourse(`main/getBooks/getSearchTitles?search=${search}`);
  };

  getBookForm = async ({ selectedItemID }) => {
    return await this.apiData.getResourse(`main/getBooks/getBookForm?selectedItemID=${selectedItemID}`);
  };

  getBook = async ({ BookID }) => {
    return await this.apiData.getText(`Images/fb2/${BookID}`);
  };
}
