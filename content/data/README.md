# Content / Data

This is the home of your Ghost database, do not overwrite this folder or any of the files inside of it.

### 一条sql语句

```sql
select a.id, a.title from posts as a left join posts_tags b on a.id = b.post_id where pt.tag_id<>9 or pt.id is null order by a.updated_at desc;
```
