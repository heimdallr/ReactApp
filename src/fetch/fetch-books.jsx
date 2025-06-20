import Api from "./api";
export default class FetchBooks {
  apiData = new Api();

  getConfig = async () => {
    return await this.apiData.getResourse(`main/getBooks/getConfig`);
  };

  getSearchStats = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchStats?${selectedGroupID ? `selectedGroupID=${selectedGroupID}` : `search=${search}`}`
    );
  };

  getSearchAuthors = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchAuthors?${selectedGroupID ? `selectedGroupID=${selectedGroupID}` : `search=${search}`}`
    );
  };

  getSearchAuthorBooks = async ({ selectedItemID, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchAuthorBooks?selectedItemID=${selectedItemID}${
        selectedGroupID ? `&selectedGroupID=${selectedGroupID}` : ``
      }`
    );
  };

  getSearchSeries = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchSeries?${selectedGroupID ? `selectedGroupID=${selectedGroupID}` : `search=${search}`}`
    );
  };

  getSearchSeriesBooks = async ({ selectedItemID, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchSeriesBooks?selectedItemID=${selectedItemID}${
        selectedGroupID ? `&selectedGroupID=${selectedGroupID}` : ``
      }`
    );
  };

  getSearchTitles = async ({ search, selectedGroupID }) => {
    return await this.apiData.getResourse(
      `main/getBooks/getSearchTitles?${selectedGroupID ? `selectedGroupID=${selectedGroupID}` : `search=${search}`}`
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
