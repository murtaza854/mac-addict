import React, { useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { lighten } from '@mui/material/styles'
import { useParams } from 'react-router';
import { useHistory } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
// import TextField from '@mui/material/TextField';
import { FormControl, Input, InputLabel } from '@mui/material';
import {
  Link,
} from "react-router-dom";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
  searchBar: {
    marginRight: '1rem',
    width: '15rem'
  },
}));


function EnhancedTableToolbar(props) {
  const { model } = useParams();
  const classes = useToolbarStyles();
  const { selected, modelName, editAllowed, deleteAllowed, addAllowed, actionOptions, startAction, setOriginalTableRows, setTableRows, deleteObjects } = props;
  const history = useHistory();
  const numSelected = selected.length;

  let editID = '';
  if (selected.length === 1) editID = selected[0];

  function handleRouteChange() {
    history.push(`/admin/${model}/add`);
  }

  const [actionState, setActionState] = React.useState(actionOptions[0]);
  const [disabled, setDisabled] = React.useState(true);

  const handleActionStateChange = (event) => {
    const { value } = event.target;
    const selectedAction = actionOptions.find(obj => obj.value === value);
    setActionState(selectedAction);
  };

  useEffect(() => {
    if (actionState.value === '') setDisabled(true);
    else setDisabled(false);
  }, [actionState])

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography style={{ textTransform: 'capitalize' }} className={classes.title} variant="h6" id="tableTitle" component="div">
          {modelName}
        </Typography>
      )}

      {numSelected > 0 ? (
        <div style={{ display: 'flex' }}>
          {deleteAllowed === true ? (
            <Link onClick={(e) => {
              e.preventDefault();
              deleteObjects();
            }}
              to={""}
            >
              <Tooltip title="Delete">
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Link>
          ) : null}
          {numSelected === 1 && editAllowed ? (
            <Link to={`/admin/${model}/edit/${editID}`}>
              <Tooltip title="Edit">
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Link>
          ) : null
          }
          {
            actionOptions.length !== 1 ? (
              <>
                <FormControl className={classes.searchBar}>
                  <InputLabel htmlFor="age-native-simple">Choose option</InputLabel>
                  <Select
                    native
                    value={actionState.value}
                    onChange={handleActionStateChange}
                  >
                    {actionOptions.map((value, index) => (
                      <option key={index} value={value.value}>{value.label}</option>
                    ))}

                  </Select>
                </FormControl>
                <Button disabled={disabled} variant="contained" onClick={e => { startAction(actionState, selected, setOriginalTableRows, setTableRows); }} color="primary">
                  Go
                </Button>
              </>
            ) : null
          }
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <FormControl className={classes.searchBar}>
            <InputLabel color="secondary" htmlFor="search">Search</InputLabel>
            <Input
              color="secondary"
              autoComplete="none"
              value={props.searchState}
              type="text"
              id="search"
              name="search"
              onChange={props.searchTableRows}
              aria-describedby="search-helper"
            />
          </FormControl>
          {addAllowed === true ? (
            <Tooltip onClick={handleRouteChange} title="Add">
              <IconButton aria-label="Add button">
                <AddIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
      )}
    </Toolbar>
  );
}

export default EnhancedTableToolbar;