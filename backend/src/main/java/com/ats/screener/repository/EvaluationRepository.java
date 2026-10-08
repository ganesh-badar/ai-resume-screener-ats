package com.ats.screener.repository;

import com.ats.screener.model.Evaluation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, String> {

    /**
     * Architectural Highlight (@EntityGraph):
     * Eliminates the N+1 select problem when fetching an Evaluation along with its
     * parent Resume, Candidate User, and target Job in a single SQL JOIN.
     */
    @EntityGraph(attributePaths = {"resume", "resume.user", "job"})
    Optional<Evaluation> findWithDetailsById(String id);

    List<Evaluation> findByJobIdOrderByCreatedAtDesc(Long jobId);
}
