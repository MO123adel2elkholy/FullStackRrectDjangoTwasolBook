from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from blog.models import Post, Category
from django.contrib.auth.models import User


class PostTests(APITestCase):

    def test_view_posts(self):
        """
        Ensure we can view all objects.
        """
        url = reverse('api:listcreate')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post(self):
        """
        Ensure we can create a new Post object and view object.
        """
        self.test_category = Category.objects.create(name='django')
        self.testuser1 = User.objects.create_superuser(
            username='test_user1',
            password='123456789',
            email='adel333mahmoud@gmail.com',
        )

        self.client.login(username=self.testuser1.username, password='123456789')

        data = {
            "title": "new",
            "author": self.testuser1.id,
            "excerpt": "new",
            "content": "new",
            "category": self.test_category.id,
            "slug": "new",
            "status": "published",
        }

        url = reverse('api:listcreate')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_update(self):
        self.test_category = Category.objects.create(name='django')
        self.testuser1 = User.objects.create_user(
            username='test_user1', password='123456789'
        )
        self.testuser2 = User.objects.create_user(
            username='test_user2', password='123456789'
        )

        test_post = Post.objects.create(
            category=self.test_category,
            title='Post Title',
            excerpt='Post Excerpt',
            content='Post Content',
            slug='post-title',
            author=self.testuser1,
            status='published',
        )

        self.client.login(username=self.testuser1.username, password='123456789')

        url = reverse('api:detaildestroy', kwargs={'pk': test_post.pk})

        response = self.client.put(
            url,
            {
                "title": "New",
                "author": self.testuser1.id,
                "excerpt": "New",
                "content": "New",
                "slug": "new-post-title",
                "status": "published",
                "category": self.test_category.id,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)