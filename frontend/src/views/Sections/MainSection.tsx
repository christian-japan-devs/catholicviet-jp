import React from 'react';
// Mateiral-ui/core
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
    card: {
        display: 'flex',
        marginTop: '2rem',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 260,
    },
}));

type post = {
    title: string,
    auth?: string,
    date: string,
    description: string,
    image?: string,
    imageTitle?: string,
    detail: string
}
type propTypes = {
    posts: post[],
    title?: string
}

const MainSection: React.FC<propTypes> = (props: propTypes) => {
    const classes = useStyles();
    const { posts, title } = props;
    return (
        <div className={classes.markdown}>
            <Typography variant='h4'>
                {title}
            </Typography>
            <Divider />
            {
                posts.map((post) => (
                    <CardActionArea key={post.title} component='a' style={{ textDecoration: 'none' }} href={post.detail}>
                        <Card className={classes.card}>
                            <div className={classes.cardDetails}>
                                <CardContent>
                                    <Typography component='h3' variant='h5'>
                                        {post.title}
                                    </Typography>
                                    <Typography variant='subtitle1' color='textSecondary'>
                                        {post.auth}
                                    </Typography>
                                    <Typography variant='subtitle1' color='textSecondary'>
                                        {post.date}
                                    </Typography>
                                    <Typography variant='subtitle1' paragraph>
                                        {post.description}
                                    </Typography>
                                </CardContent>
                            </div>
                            <Hidden smDown>
                                <CardMedia className={classes.cardMedia} image={post.image} title={post.imageTitle} />
                            </Hidden>
                        </Card>
                    </CardActionArea>
                ))}
        </div>
    );
};
export default MainSection;