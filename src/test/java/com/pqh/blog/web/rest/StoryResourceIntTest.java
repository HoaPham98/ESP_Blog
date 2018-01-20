package com.pqh.blog.web.rest;

import com.pqh.blog.BlogApp;

import com.pqh.blog.domain.Story;
import com.pqh.blog.repository.StoryRepository;
import com.pqh.blog.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.pqh.blog.web.rest.TestUtil.sameInstant;
import static com.pqh.blog.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the StoryResource REST controller.
 *
 * @see StoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BlogApp.class)
public class StoryResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restStoryMockMvc;

    private Story story;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StoryResource storyResource = new StoryResource(storyRepository);
        this.restStoryMockMvc = MockMvcBuilders.standaloneSetup(storyResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Story createEntity(EntityManager em) {
        Story story = new Story()
            .title(DEFAULT_TITLE)
            .content(DEFAULT_CONTENT)
            .date(DEFAULT_DATE)
            .imageUrl(DEFAULT_IMAGE_URL);
        return story;
    }

    @Before
    public void initTest() {
        story = createEntity(em);
    }

    @Test
    @Transactional
    public void createStory() throws Exception {
        int databaseSizeBeforeCreate = storyRepository.findAll().size();

        // Create the Story
        restStoryMockMvc.perform(post("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isCreated());

        // Validate the Story in the database
        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeCreate + 1);
        Story testStory = storyList.get(storyList.size() - 1);
        assertThat(testStory.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testStory.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testStory.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testStory.getImageUrl()).isEqualTo(DEFAULT_IMAGE_URL);
    }

    @Test
    @Transactional
    public void createStoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = storyRepository.findAll().size();

        // Create the Story with an existing ID
        story.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoryMockMvc.perform(post("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isBadRequest());

        // Validate the Story in the database
        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = storyRepository.findAll().size();
        // set the field null
        story.setTitle(null);

        // Create the Story, which fails.

        restStoryMockMvc.perform(post("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isBadRequest());

        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = storyRepository.findAll().size();
        // set the field null
        story.setContent(null);

        // Create the Story, which fails.

        restStoryMockMvc.perform(post("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isBadRequest());

        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = storyRepository.findAll().size();
        // set the field null
        story.setDate(null);

        // Create the Story, which fails.

        restStoryMockMvc.perform(post("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isBadRequest());

        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStories() throws Exception {
        // Initialize the database
        storyRepository.saveAndFlush(story);

        // Get all the storyList
        restStoryMockMvc.perform(get("/api/stories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(story.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL.toString())));
    }

    @Test
    @Transactional
    public void getStory() throws Exception {
        // Initialize the database
        storyRepository.saveAndFlush(story);

        // Get the story
        restStoryMockMvc.perform(get("/api/stories/{id}", story.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(story.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingStory() throws Exception {
        // Get the story
        restStoryMockMvc.perform(get("/api/stories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStory() throws Exception {
        // Initialize the database
        storyRepository.saveAndFlush(story);
        int databaseSizeBeforeUpdate = storyRepository.findAll().size();

        // Update the story
        Story updatedStory = storyRepository.findOne(story.getId());
        // Disconnect from session so that the updates on updatedStory are not directly saved in db
        em.detach(updatedStory);
        updatedStory
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .date(UPDATED_DATE)
            .imageUrl(UPDATED_IMAGE_URL);

        restStoryMockMvc.perform(put("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStory)))
            .andExpect(status().isOk());

        // Validate the Story in the database
        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeUpdate);
        Story testStory = storyList.get(storyList.size() - 1);
        assertThat(testStory.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testStory.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testStory.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStory.getImageUrl()).isEqualTo(UPDATED_IMAGE_URL);
    }

    @Test
    @Transactional
    public void updateNonExistingStory() throws Exception {
        int databaseSizeBeforeUpdate = storyRepository.findAll().size();

        // Create the Story

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restStoryMockMvc.perform(put("/api/stories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(story)))
            .andExpect(status().isCreated());

        // Validate the Story in the database
        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteStory() throws Exception {
        // Initialize the database
        storyRepository.saveAndFlush(story);
        int databaseSizeBeforeDelete = storyRepository.findAll().size();

        // Get the story
        restStoryMockMvc.perform(delete("/api/stories/{id}", story.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Story> storyList = storyRepository.findAll();
        assertThat(storyList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Story.class);
        Story story1 = new Story();
        story1.setId(1L);
        Story story2 = new Story();
        story2.setId(story1.getId());
        assertThat(story1).isEqualTo(story2);
        story2.setId(2L);
        assertThat(story1).isNotEqualTo(story2);
        story1.setId(null);
        assertThat(story1).isNotEqualTo(story2);
    }
}
