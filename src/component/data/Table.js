import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import {
  Paper,
  Table as MuiTable,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableSortLabel,
} from "@material-ui/core";

class EnhancedTableHead extends React.PureComponent {
  static propTypes = {
    onRequestSort: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.string,
  };

  createSortHandler = (property) => () => {
    const { onRequestSort } = this.props;

    if (onRequestSort) {
      onRequestSort(property);
    }
  };

  render() {
    const { cells, order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {cells.map((cell) => {
            const alignRight = !!cell.alignRight;
            const active = orderBy === cell.property;

            return (
              <TableCell
                key={cell.property}
                numeric={alignRight}
                padding={cell.disablePadding ? "none" : "default"}
                sortDirection={active ? order : false}
                style={cell.style}
              >
                {cell.label &&
                  (cell.sortable ? (
                    <Tooltip
                      title="Sort"
                      placement={alignRight ? "bottom-end" : "bottom-start"}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={active}
                        direction={order || "desc"}
                        onClick={this.createSortHandler(cell.property)}
                      >
                        {cell.label}
                      </TableSortLabel>
                    </Tooltip>
                  ) : (
                    cell.label
                  ))}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

class Table extends React.PureComponent {
  static propTypes = {
    uniqueKeyProperty: PropTypes.string.isRequired,
    hidePagination: PropTypes.bool,
  };

  static defaultProps = {
    uniqueKeyProperty: "id",
    hidePagination: false,
  };

  state = {
    order: null,
    orderBy: null,
  };

  render() {
    const {
      cells,
      labelledBy,
      data,
      rowsPerPage,
      page,
      uniqueKeyProperty,
      onRequestSort,
      hidePagination,
    } = this.props;
    const { order, orderBy } = this.state;

    const hasData = Array.isArray(data);

    return (
      <Paper>
        <TableWrapper>
          <StyledTable aria-labelledby={labelledBy}>
            <EnhancedTableHead
              cells={cells}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
            />
            <TableBody>
              {hasData &&
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const uniqueKey = row[uniqueKeyProperty];

                    return (
                      <TableRow hover key={uniqueKey}>
                        {cells.map((cell) => {
                          const cellValue = row.hasOwnProperty(cell.property)
                            ? row[cell.property]
                            : undefined;

                          return (
                            <TableCell
                              key={cell.property}
                              numeric={!!cell.alignRight}
                              padding={cell.disablePadding ? "none" : "default"}
                              style={cell.style}
                            >
                              {cell.format
                                ? cell.format(cellValue, row)
                                : cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        {!hidePagination && (
          <TablePagination
            component="div"
            count={hasData ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        )}
      </Paper>
    );
  }

  handleChangePage = (ev, page) => {
    const { onChangePage } = this.props;

    if (onChangePage) {
      onChangePage(page);
    }
  };

  handleChangeRowsPerPage = (event) => {
    const { onChangeRowsPerPage } = this.props;

    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(event.target.value);
    }
  };
}

const TableWrapper = styled.div`
	overflow-x: auto;
`;

const StyledTable = styled(MuiTable)`
	min-width: ${(p) => p.theme.mui.breakpoints.values.sm}px;
`;

export default Table;
