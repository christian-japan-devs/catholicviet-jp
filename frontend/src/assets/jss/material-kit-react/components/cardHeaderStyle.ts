import { makeStyles } from '@material-ui/core/styles';

import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader
} from "../../material-kit-react.js";

export const cardHeaderStyle = makeStyles(() => ({
  cardHeader: {
    borderRadius: "3px",
    padding: "1rem 15px",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    border: "0",
    marginBottom: "0",
  },
  cardHeaderPlain: {
    marginLeft: "0px",
    marginRight: "0px",
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
}));
