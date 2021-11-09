import Checkbox from '@material-ui/core/Checkbox';
import Grid  from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';


export interface CustomLegendItem{
  label: string,
  color: string,
  shown: boolean;
  onItemChange: any;
}

export interface CustomLegendProps{
  barItems?: CustomLegendItem[]
  lineItems?: CustomLegendItem[]
}

const useStyles = makeStyles({
  paper: {
    margin: '1rem',
    padding: '1rem',
    height: '30px'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '3px',
    justifyContent: 'center',
  }
})


export function CustomLegend(props: CustomLegendProps){

  const styles = useStyles();

  const {barItems, lineItems} = props

  return(
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container justify-content="center" spacing={2}>
          {barItems?.map((legendItem) => (
              <Paper className={styles.paper} style={{background: legendItem.color}}>
                <div className={styles.container}>
                <Checkbox
                  checked={legendItem.shown}
                  onChange={legendItem.onItemChange}
                  color="default"
                />
                  <span>{legendItem.label}</span>
                </div>
                </Paper>
          ))}
          </Grid>
          <Grid container justify-content="center" spacing={2}>
          {lineItems?.map((legendItem) => (
              <Paper className={styles.paper} style={{background: legendItem.color}}>
                <div className={styles.container}>
                <Checkbox
                  checked={legendItem.shown}
                  onChange={legendItem.onItemChange}
                  color="default"
                />
                  <span>{legendItem.label}</span>
                </div>
                </Paper>
          ))}
          </Grid> 
      </Grid>
    </Grid>


  )
}
