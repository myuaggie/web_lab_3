package dao.impl;

import dao.LibraryDao;
import model.ULKey;
import model.UQ_Library;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import java.util.List;

public class LibraryDaoImpl extends HibernateDaoSupport implements LibraryDao {
    public void save(UQ_Library library){
        getHibernateTemplate().save(library);
    }

    public void delete(UQ_Library library){
        getHibernateTemplate().delete(library);
    }

    public void update(UQ_Library library){
        getHibernateTemplate().merge(library);
    }

    public UQ_Library getLibraryByKey(ULKey key){
        @SuppressWarnings("unchecked")
        List<UQ_Library> ls = (List<UQ_Library>) getHibernateTemplate().find(
                "from UQ_Library as l where l.ulKey.userId=? and l.ulKey.libraryId=?", key.getUserId(),key.getLibraryId());
        UQ_Library l = ls.size() > 0 ? ls.get(0) : null;
        return l;
    }

    public List<UQ_Library> getAllLibrariesById(int id){
        @SuppressWarnings("unchecked")
        List<UQ_Library> ls = (List<UQ_Library>) getHibernateTemplate()
                .find("from UQ_Library as l where l.ulKey.userId=?",id);
        return ls;
    }

    public List<UQ_Library> getAllLibraries(){
        @SuppressWarnings("unchecked")
        List<UQ_Library> ls = (List<UQ_Library>) getHibernateTemplate()
                .find("from UQ_Library");
        return ls;
    }
}
