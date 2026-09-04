import * as React from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DeleteForever, Edit } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Posts = ({ posts = [] }) => {
  if (!posts.length) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No posts found.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer>
          <Table stickyHeader aria-label="posts table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="left">Category</TableCell>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell component="th" scope="row">
                    {post.id}
                  </TableCell>

                  <TableCell align="left">
                    {post.category || 'Uncategorized'}
                  </TableCell>

                  <TableCell align="left">
                    <RouterLink
                      to={`/post/${post.slug}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {post.title}
                    </RouterLink>
                  </TableCell>

                  <TableCell align="left">
                    <RouterLink
                      to={`/admin/edit/${post.id}`}
                      style={{ color: '#1976d2', marginRight: 12 }}
                      aria-label="Edit post"
                    >
                      <Edit fontSize="small" />
                    </RouterLink>

                    <RouterLink
                      to={`/admin/delete/${post.id}`}
                      style={{ color: '#d32f2f' }}
                      aria-label="Delete post"
                    >
                      <DeleteForever fontSize="small" />
                    </RouterLink>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Button
                    component={RouterLink}
                    to="/admin/create"
                    variant="contained"
                    color="primary"
                  >
                    New Post
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Posts;