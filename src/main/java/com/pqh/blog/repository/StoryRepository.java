package com.pqh.blog.repository;

import com.pqh.blog.domain.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Story entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    @Query("select story from Story story where story.user.login = ?#{principal.username}")
    List<Story> findByUserIsCurrentUser();

    @Query("select story from Story story order by story.date desc")
    List<Story> getPopularStories();

}
