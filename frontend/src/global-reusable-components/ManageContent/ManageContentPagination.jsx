import { TablePagination } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { manageContentSelector } from "../../global-redux/ManageContentSlice";
import useManageContentFunctions from "./ManageContentFunctions";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";

export default function ManageContentPagination() {
  const { contentDataCount, contentCurrentPageNumber, contentRowsPerPage } =
    useSelector(manageContentSelector);

  const { handleChangePage, handleChangeRowsPerPage, themeColors } =
    useManageContentFunctions();

  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
  const colors = themeColors[theme];
  return (
    <>
      <TablePagination
        component="div"
        count={contentDataCount?.totalCount || 0}
        page={contentCurrentPageNumber}
        onPageChange={handleChangePage}
        rowsPerPage={contentRowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.tableHeaderBg,
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              color: colors.textPrimary,
            },
          "& .MuiTablePagination-select": {
            color: colors.textPrimary,
            backgroundColor: colors.inputBackground,
          },
          "& .MuiTablePagination-actions button": {
            color: colors.textPrimary,
            "&:hover": {
              backgroundColor: colors.tableRowHover,
            },
            "&.Mui-disabled": {
              color: colors.textSecondary,
            },
          },
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: colors.cardBackground,
                color: colors.textPrimary,
                "& .MuiMenuItem-root": {
                  color: colors.textPrimary,
                  "&:hover": {
                    backgroundColor: colors.tableRowHover,
                  },
                  "&.Mui-selected": {
                    backgroundColor: `${colors.chipBackground} !important`,
                  },
                },
              },
            },
          },
        }}
      />
    </>
  );
}
