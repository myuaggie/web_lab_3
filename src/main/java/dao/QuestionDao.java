package dao;

import model.Question;

import java.util.List;

public interface QuestionDao {
    public Integer save(Question question);

    public void delete(Question question);

    public void update(Question question);

    public Question getQuestionById(int id);

    public List<Question> getAllQuestions();
}
