package dao.impl;

import dao.QuestionDao;

import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import model.Question;

import java.util.List;

public class QuestionDaoImpl extends HibernateDaoSupport implements QuestionDao {
    public Integer save(Question question){
        return (Integer) getHibernateTemplate().save(question);
    }

    public void delete(Question question){
        getHibernateTemplate().delete(question);
    }

    public void update(Question question){
        getHibernateTemplate().merge(question);
    }

    public Question getQuestionById(int id){
        @SuppressWarnings("unchecked")
        List<Question> questions = (List<Question>) getHibernateTemplate().find(
                "from Question as q where q.id=?", id);
        Question question = questions.size() > 0 ? questions.get(0) : null;
        return question;
    }

    public List<Question> getAllQuestions(){
        @SuppressWarnings("unchecked")
        List<Question> questions = (List<Question>) getHibernateTemplate().find(
                "from Question");
        return questions;
    }
}
