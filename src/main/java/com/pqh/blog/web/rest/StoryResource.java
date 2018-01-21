package com.pqh.blog.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.pqh.blog.domain.Story;

import com.pqh.blog.repository.StoryRepository;
import com.pqh.blog.security.SecurityUtils;
import com.pqh.blog.web.rest.errors.BadRequestAlertException;
import com.pqh.blog.web.rest.util.HeaderUtil;
import com.pqh.blog.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Story.
 */
@RestController
@RequestMapping("/api")
public class StoryResource {

    private final Logger log = LoggerFactory.getLogger(StoryResource.class);

    private static final String ENTITY_NAME = "story";

    private final StoryRepository storyRepository;

    public StoryResource(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    /**
     * POST  /stories : Create a new story.
     *
     * @param story the story to create
     * @return the ResponseEntity with status 201 (Created) and with body the new story, or with status 400 (Bad Request) if the story has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stories")
    @Timed
    public ResponseEntity<Story> createStory(@Valid @RequestBody Story story) throws URISyntaxException {
        log.debug("REST request to save Story : {}", story);
        if (story.getId() != null) {
            throw new BadRequestAlertException("A new story cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Story result = storyRepository.save(story);
        return ResponseEntity.created(new URI("/api/stories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /stories : Updates an existing story.
     *
     * @param story the story to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated story,
     * or with status 400 (Bad Request) if the story is not valid,
     * or with status 500 (Internal Server Error) if the story couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/stories")
    @Timed
    public ResponseEntity<Story> updateStory(@Valid @RequestBody Story story) throws URISyntaxException {
        log.debug("REST request to update Story : {}", story);
        if (story.getId() == null) {
            return createStory(story);
        }
        Story result = storyRepository.save(story);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, story.getId().toString()))
            .body(result);
    }

    /**
     * GET  /stories : get all the stories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of stories in body
     */
    @GetMapping("/stories")
    @Timed
    public ResponseEntity<List<Story>> getAllStories(Pageable pageable) {
        log.debug("REST request to get a page of Stories");
        Page<Story> page = storyRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/stories");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /stories/:id : get the "id" story.
     *
     * @param id the id of the story to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the story, or with status 404 (Not Found)
     */
    @GetMapping("/stories/{id}")
    @Timed
    public ResponseEntity<Story> getStory(@PathVariable Long id) {
        log.debug("REST request to get Story : {}", id);
        Story story = storyRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(story));
    }

    /**
     * DELETE  /stories/:id : delete the "id" story.
     *
     * @param id the id of the story to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/stories/{id}")
    @Timed
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        log.debug("REST request to delete Story : {}", id);
        storyRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
