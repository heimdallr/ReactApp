import React from "react";

function Table() {
  return (
    <motion.table
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      transition={{ duration: 0.5 }}
      className="table table-sm table-dark table-striped"
    >
      {/* <table className="table table-sm table-dark table-striped"> */}
      <thead>
        <tr>
          <th onClick={() => this.handleSortHead("LibRate")}>LibRate</th>
          <th onClick={() => this.handleSortHead("Title")}>Title</th>
          <th onClick={() => this.handleSortHead("SeriesTitle")}>SeriesTitle</th>
          <th onClick={() => this.handleSortHead("AuthorsNames")}>AuthorsNames</th>
          <th onClick={() => this.handleSortHead("BookSize")}>BookSize</th>
          <th onClick={() => this.handleSortHead("Lang")}>Lang</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>{this.tableRecords()}</AnimatePresence>
      </tbody>
      {/* </table> */}
    </motion.table>
  );
}

export default Table;
